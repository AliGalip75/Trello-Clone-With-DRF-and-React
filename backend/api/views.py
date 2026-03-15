from django.db import transaction
from django.db.models import F, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Board, List, Card, Comment
from .serializers import BoardSerializer, ListSerializer, CardSerializer, CommentSerializer

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return boards where the user is either the owner or a member
        # Use prefetch_related and select_related to prevent N+1 query performance issues
        return Board.objects.filter(
            Q(owner=self.request.user) | Q(members=self.request.user)
        ).prefetch_related('lists__cards__comments', 'members').select_related('owner').distinct()

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the board owner
        serializer.save(owner=self.request.user)


class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Check permissions via board ownership or membership
        return List.objects.filter(
            Q(board__owner=self.request.user) | Q(board__members=self.request.user)
        ).prefetch_related('cards__comments').distinct()


class CardViewSet(viewsets.ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Check permissions via board ownership or membership
        return Card.objects.filter(
            Q(list__board__owner=self.request.user) | Q(list__board__members=self.request.user)
        ).prefetch_related('comments').distinct()

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        # Move a card to a new position or a new list
        card = self.get_object()
        new_order = request.data.get('order')
        new_list_id = request.data.get('list_id')

        if new_order is None:
            return Response({"detail": "New order not provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_order = int(new_order)
        except ValueError:
            return Response({"detail": "Invalid order format."}, status=status.HTTP_400_BAD_REQUEST)

        old_list = card.list
        old_order = card.order

        try:
            with transaction.atomic():
                if new_list_id and int(new_list_id) != old_list.id:
                    # Moving to a different list; verify permissions for the target list
                    try:
                        new_list = List.objects.get(
                            id=new_list_id,
                            board__id__in=Board.objects.filter(
                                Q(owner=self.request.user) | Q(members=self.request.user)
                            ).values('id')
                        )
                    except List.DoesNotExist:
                        return Response({"detail": "New list not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

                    # Remove card from old list's ordering by shifting subsequent cards up
                    old_list.cards.filter(order__gt=old_order).update(order=F('order') - 1)
                    
                    # Add card to new list's ordering by shifting subsequent cards down
                    new_list.cards.filter(order__gte=new_order).update(order=F('order') + 1)
                    
                    card.list = new_list
                else:
                    # Moving within the same list
                    if old_order > new_order:
                        # Shifting cards down to make room at the top
                        old_list.cards.filter(order__gte=new_order, order__lt=old_order).update(order=F('order') + 1)
                    elif old_order < new_order:
                        # Shifting cards up to fill the gap at the top
                        old_list.cards.filter(order__gt=old_order, order__lte=new_order).update(order=F('order') - 1)

                # Assign the new order and save the card
                card.order = new_order
                card.save()

            return Response(self.get_serializer(card).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Check permissions via board ownership or membership
        return Comment.objects.filter(
            Q(card__list__board__owner=self.request.user) | Q(card__list__board__members=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the comment author
        serializer.save(author=self.request.user)
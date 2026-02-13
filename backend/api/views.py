from django.db import transaction
from django.db.models import F
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Board, List, Card, Comment
from .serializers import BoardSerializer, ListSerializer, CardSerializer, CommentSerializer

class BoardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows boards to be viewed or edited.
    """
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the boards
        for the currently authenticated user.
        """
        return Board.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Associate the board with the logged-in user.
        """
        serializer.save(owner=self.request.user)

class ListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lists to be viewed or edited.
    """
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the lists for
        the boards owned by the currently authenticated user.
        """
        return List.objects.filter(board__owner=self.request.user)

class CardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cards to be viewed or edited.
    """
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the cards for
        the lists on boards owned by the currently authenticated user.
        """
        return Card.objects.filter(list__board__owner=self.request.user)

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """
        Move a card to a new position, potentially in a new list.
        """
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
                if new_list_id and new_list_id != old_list.id:
                    # Moving to a different list
                    try:
                        new_list = List.objects.get(id=new_list_id, board__owner=self.request.user)
                    except List.DoesNotExist:
                        return Response({"detail": "New list not found or you don't have permission."}, status=status.HTTP_404_NOT_FOUND)

                    # Remove card from old list's ordering
                    old_list.cards.filter(order__gt=old_order).update(order=F('order') - 1)
                    
                    # Add card to new list's ordering
                    new_list.cards.filter(order__gte=new_order).update(order=F('order') + 1)
                    
                    card.list = new_list
                else:
                    # Moving within the same list
                    if old_order > new_order:
                        old_list.cards.filter(order__gte=new_order, order__lt=old_order).update(order=F('order') + 1)
                    elif old_order < new_order:
                        old_list.cards.filter(order__gt=old_order, order__lte=new_order).update(order=F('order') - 1)

                # Update the card's order and save
                card.order = new_order
                card.save()

            return Response(self.get_serializer(card).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows comments to be viewed or edited.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the comments for
        cards on lists on boards owned by the currently authenticated user.
        """
        return Comment.objects.filter(card__list__board__owner=self.request.user)

    def perform_create(self, serializer):
        """
        Associate the comment with the logged-in user as the author.
        """
        serializer.save(author=self.request.user)

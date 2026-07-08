from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Workspace, Board, List, Card, Comment

User = get_user_model()


"""
UserSerializer
"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


"""
CommentSerializer
"""
class CommentSerializer(serializers.ModelSerializer):
    # Read-only nested representation of the author
    author_detail = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'card', 'author', 'author_detail', 'text', 'created_at']
        # Author should typically be set automatically in the view's perform_create method
        read_only_fields = ['id', 'created_at', 'author']


"""
CardSerializer
"""
class CardSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    list_id = serializers.PrimaryKeyRelatedField(
        queryset=List.objects.all(),
        source='list',
        write_only=True,
    )

    class Meta:
        model = Card
        fields = ['id', 'name', 'description', 'order', 'list_id', 'comments']


"""
ListSerializer
"""
class ListSerializer(serializers.ModelSerializer):
    # Read-only nested representation of cards attached to the list
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'board', 'name', 'order', 'cards', 'created_at']
        read_only_fields = ['id', 'created_at']


"""
BoardSerializer
"""
class BoardSerializer(serializers.ModelSerializer):
    # Read-only nested representations for owner, members, and lists
    owner_detail = UserSerializer(source='owner', read_only=True)
    members_detail = UserSerializer(source='members', many=True, read_only=True)
    lists = ListSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = [
            'id', 'workspace', 'owner', 'owner_detail', 'members', 'members_detail',
            'name', 'background_color', 'background_image', 'lists',
            'created_at', 'updated_at'
        ]
        # Owner should typically be set automatically in the view's perform_create method
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']


"""
WorkspaceSerializer
"""
class WorkspaceSerializer(serializers.ModelSerializer):
    # Read-only nested representations for owner and members
    owner_detail = UserSerializer(source='owner', read_only=True)
    members_detail = UserSerializer(source='members', many=True, read_only=True)
    # Nested boards belonging to this workspace (read-only summary, no deep nesting)
    boards = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = [
            'id', 'name', 'description',
            'owner', 'owner_detail', 'members', 'members_detail',
            'boards', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def get_boards(self, obj):
        """Return a lightweight list of boards (id, name, background info) for the workspace."""
        request = self.context.get('request')
        boards = []
        for b in obj.boards.all():
            if b.background_image and request:
                bg_image = request.build_absolute_uri(b.background_image.url)
            elif b.background_image:
                bg_image = b.background_image.url
            else:
                bg_image = None
            boards.append({
                'id': b.id,
                'name': b.name,
                'background_color': b.background_color,
                'background_image': bg_image,
            })
        return boards

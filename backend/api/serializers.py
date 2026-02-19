from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Board, List, Card, Comment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'text', 'author', 'card', 'created_at']
        read_only_fields = ['created_at']

class CardSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'name', 'description', 'order', 'list', 'comments']

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'name', 'order', 'board', 'cards']

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    lists = ListSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'owner', 'lists', 'background_color', 'background_image']

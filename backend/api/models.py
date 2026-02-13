from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Board(models.Model):
    owner = models.ForeignKey(User, related_name='boards', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Board"
        verbose_name_plural = "Boards"
        db_table = "board"

class List(models.Model):
    board = models.ForeignKey(Board, related_name='lists', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "List"
        verbose_name_plural = "Lists"
        db_table = "list"

class Card(models.Model):
    list = models.ForeignKey(List, related_name='cards', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Card"
        verbose_name_plural = "Cards"
        db_table = "card"

class Comment(models.Model):
    card = models.ForeignKey(Card, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author} on {self.card}'
    
    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        db_table = "comment"

from django.db import models
from django.contrib.auth import get_user_model
from PIL import Image
from io import BytesIO
from django.core.files import File
import os

User = get_user_model()

# Generate dynamic path: user_<id>/boards_bg/<filename>
def board_bg_upload_path(instance, filename):
    return f'user_{instance.owner.id}/boards_bg/{filename}'

class Board(models.Model):
    owner = models.ForeignKey(User, related_name='owned_boards', on_delete=models.CASCADE)
    # Added members for collaboration
    members = models.ManyToManyField(User, related_name='boards', blank=True)
    name = models.CharField(max_length=100)
    # Added background for visual customization (could be a hex code or image URL)
    background_color = models.CharField(max_length=20, default="#ffffff")
    # Use the dynamic path function
    background_image = models.ImageField(upload_to=board_bg_upload_path, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override save method to scale down large images
    def save(self, *args, **kwargs):
        if self.background_image:
            img = Image.open(self.background_image)
            
            # Scale down if dimensions exceed 1280x720
            if img.width > 1280 or img.height > 720:
                output_size = (1280, 720)
                img.thumbnail(output_size, Image.Resampling.LANCZOS)
                
                output_io = BytesIO()
                img_format = img.format if img.format else 'JPEG'
                # Compress slightly for better performance
                img.save(output_io, format=img_format, quality=85)
                
                self.background_image = File(output_io, name=self.background_image.name)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Board"
        verbose_name_plural = "Boards"
        db_table = "board"
        ordering = ['-updated_at']

class List(models.Model):
    board = models.ForeignKey(Board, related_name='lists', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "List"
        verbose_name_plural = "Lists"
        db_table = "list"
        ordering = ['order']

class Card(models.Model):
    list = models.ForeignKey(List, related_name='cards', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()
    # Added due_date for task management
    due_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Card"
        verbose_name_plural = "Cards"
        db_table = "card"
        ordering = ['order']

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
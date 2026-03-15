# admin.py
from django.contrib import admin
from .models import Board, List, Card, Comment

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ('name', 'board', 'order')

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('name', 'list', 'order', 'due_date')

admin.site.register(Comment)
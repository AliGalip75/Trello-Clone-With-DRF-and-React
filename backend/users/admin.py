from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from api.models import Board

User = get_user_model()

class BoardInline(admin.TabularInline):
    model = Board
    fk_name = 'owner'
    extra = 0
    fields = ('name', 'background_color', 'created_at')
    readonly_fields = ('created_at',)
    show_change_link = True

# Check if User is registered before unregistering to prevent NotRegistered error
if admin.site.is_registered(User):
    admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [BoardInline]
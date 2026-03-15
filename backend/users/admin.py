from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import gettext_lazy as _
from api.models import Board

User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    """
    Custom User Creation Form - username alanını zorunlu yapmaz
    """
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email',)  # Sadece email göster, username'i gösterme
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # username alanını formdan tamamen kaldır
        if 'username' in self.fields:
            del self.fields['username']

class CustomUserChangeForm(UserChangeForm):
    """
    Custom User Change Form
    """
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ('email', 'first_name', 'last_name', 'phone_number', 
                  'birth_date', 'profile_image', 'bio', 'is_active', 
                  'is_staff', 'email_verified')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # username alanını formdan kaldır (ama readonly olarak göstermek istersen yorum satırına al)
        if 'username' in self.fields:
            del self.fields['username']

class BoardInline(admin.TabularInline):
    model = Board
    fk_name = 'owner'
    extra = 1
    fields = ('name', 'background_color', 'created_at')
    readonly_fields = ('created_at',)
    show_change_link = True

# Check if User is registered before unregistering
if admin.site.is_registered(User):
    admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [BoardInline]
    
    # Custom formları kullan
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    # Listede görünecek alanlar
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'email_verified')
    
    # Detay sayfasındaki fieldset düzeni
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone_number', 
                                         'birth_date', 'profile_image', 'bio')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'email_verified', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Security'), {'fields': ('failed_login_attempts', 'account_locked_until')}),
    )
    
    # Yeni kullanıcı ekleme sayfasındaki alanlar
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )
    
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    # Readonly alanlar
    readonly_fields = ('last_login', 'date_joined', 
                       'failed_login_attempts', 'account_locked_until')
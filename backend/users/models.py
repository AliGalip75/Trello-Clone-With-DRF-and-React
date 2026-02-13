from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class UserManager(BaseUserManager):
    """
    Custom User Manager.
    Handles the creation logic for both standard users and superusers.
    Replacing the default Django manager to support Email-based authentication.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError("The Email field must be set")

        # Normalize the email address (lowercase the domain part)
        email = self.normalize_email(email)

        # Create the user instance
        user = self.model(
            email=email,
            **extra_fields,
        )

        # Hash the password using Django's standard hashing mechanism
        user.set_password(password)
        
        # Save the user to the database
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a Superuser with the given email and password.
        Ensures that is_staff and is_superuser are set to True.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
    """
    Custom User Model.
    Replaces Django's default 'User' model.
    Uses 'email' as the unique identifier for authentication instead of 'username'.
    """

    # =========================
    # CORE FIELDS
    # =========================
    email = models.EmailField(
        unique=True,
        max_length=255,
        verbose_name="Email Address",
    )

    # Username is optional but kept for flexibility or display purposes
    username = models.CharField(
        max_length=150,
        null=True,
        blank=True,
        verbose_name="Username",
    )

    # =========================
    # PERSONAL INFO
    # =========================
    first_name = models.CharField(
        max_length=150,
        blank=True,
    )

    last_name = models.CharField(
        max_length=150,
        blank=True,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    birth_date = models.DateField(
        null=True,
        blank=True,
    )

    # Requires 'Pillow' library to be installed
    profile_image = models.ImageField(
        upload_to="users/profile_images/",
        null=True,
        blank=True,
    )
    
    bio = models.TextField(
        blank=True,
    )

    # =========================
    # STATUS & PERMISSIONS
    # =========================
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
    )

    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into this admin site.",
    )

    # PermissionsMixin provides:
    # - is_superuser
    # - groups
    # - user_permissions

    # =========================
    # TIMESTAMPS
    # =========================
    date_joined = models.DateTimeField(
        default=timezone.now,
    )

    last_updated = models.DateTimeField(
        auto_now=True,
    )

    last_login = models.DateTimeField(
        null=True,
        blank=True,
    )

    # =========================
    # SECURITY & CUSTOM LOGIC
    # =========================
    email_verified = models.BooleanField(
        default=False,
        help_text="Has the user verified their email address?",
    )

    failed_login_attempts = models.PositiveIntegerField(
        default=0,
        help_text="Counter for failed login attempts to prevent brute-force attacks.",
    )

    account_locked_until = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp until which the account remains locked.",
    )

    # =========================
    # AUTH CONFIGURATION
    # =========================
    # This tells Django to use 'email' field for login
    USERNAME_FIELD = "email" 
    
    # Fields required when creating a superuser via CLI (besides email and password)
    REQUIRED_FIELDS = [] 

    # Link the custom manager
    objects = UserManager()

    # =========================
    # METHODS
    # =========================
    def __str__(self):
        return self.email

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        """
        Returns the short name for the user (first name or email).
        """
        return self.first_name or self.email

    def lock_account(self, minutes=15):
        """
        Locks the account for a specific duration (default: 15 minutes).
        """
        self.account_locked_until = timezone.now() + timezone.timedelta(minutes=minutes)
        self.save(update_fields=["account_locked_until"])

    def unlock_account(self):
        """
        Unlocks the account and resets the failed login counter.
        """
        self.failed_login_attempts = 0
        self.account_locked_until = None
        self.save(update_fields=["failed_login_attempts", "account_locked_until"])

    def is_account_locked(self):
        """
        Checks if the account is currently locked based on the timestamp.
        Returns True if locked, False otherwise.
        """
        if self.account_locked_until is None:
            return False
        return timezone.now() < self.account_locked_until

    def increase_failed_login(self):
        """
        Increments the failed login attempts counter.
        """
        self.failed_login_attempts += 1
        self.save(update_fields=["failed_login_attempts"])

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]
        db_table = "user"
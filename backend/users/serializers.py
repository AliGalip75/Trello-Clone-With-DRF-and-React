from rest_framework import serializers
from django.contrib.auth import get_user_model

# Get the active User model (Best Practice)
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for User Registration.
    Handles the creation of a new user and ensures the password is encrypted.
    """
    
    # Password field: 
    # - write_only: Will not be included in the API response.
    # - required: Must be provided during registration.
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )
    
    # Optional: You can add password confirmation logic here if needed.

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def create(self, validated_data):
        """
        Overriding the create method to use the custom manager's create_user method.
        This ensures the password is hashed properly before saving.
        """
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User Profile (Read/Update).
    Used to return user details to the frontend.
    """
    
    # We can include method fields or extra properties if needed
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        # Define which fields should be exposed to the frontend
        fields = (
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'full_name', 
            'bio', 
            'profile_image', 
            'date_joined'
        )
        # Sensitive or system-managed fields should be read-only
        read_only_fields = ('email', 'date_joined', 'full_name')
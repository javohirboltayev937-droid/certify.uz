from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


def normalize_phone(value: str) -> str:
    """Telefon raqamni standartlashtirish: bo'shliq/chiziqlarni olib, + qo'shadi."""
    phone = (value or '').strip()
    for ch in (' ', '-', '(', ')'):
        phone = phone.replace(ch, '')
    if phone and not phone.startswith('+'):
        phone = '+' + phone
    return phone


class RegisterSerializer(serializers.ModelSerializer):
    """Soddalashtirilgan ro'yxat: faqat ism, familiya, telefon va parol.

    Username avtomatik telefon raqamdan yaratiladi, email ixtiyoriy.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    phone = serializers.CharField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'password', 'password2']

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError('Ism kiriting')
        return value.strip()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError('Familiya kiriting')
        return value.strip()

    def validate_phone(self, value):
        phone = normalize_phone(value)
        if len(phone) < 7:
            raise serializers.ValidationError('To\'g\'ri telefon raqam kiriting')
        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan')
        return phone

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Parollar mos kelmadi'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        phone = validated_data['phone']
        # Username sifatida telefon raqamdan foydalanamiz (unikal va kirish uchun)
        user = User.objects.create_user(username=phone, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Telefon raqam orqali kirish (eski username/email ham qabul qilinadi)."""
    phone = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = (attrs.get('phone') or attrs.get('username') or '').strip()
        password = attrs.get('password')
        if not identifier:
            raise serializers.ValidationError('Telefon raqam kiriting')

        user = None
        phone = normalize_phone(identifier)
        if phone:
            user = User.objects.filter(phone=phone).first()
        if not user:
            user = User.objects.filter(username=identifier).first()
        if not user and '@' in identifier:
            user = User.objects.filter(email__iexact=identifier).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError('Telefon yoki parol noto\'g\'ri')
        if not user.is_active:
            raise serializers.ValidationError('Hisob faol emas')

        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    has_active_subscription = serializers.ReadOnlyField()
    telegram_linked = serializers.ReadOnlyField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'avatar', 'role', 'bio', 'date_of_birth', 'region', 'school',
            'is_premium', 'premium_until', 'has_active_subscription',
            'telegram_linked', 'telegram_username',
            'email_verified', 'created_at',
        ]
        read_only_fields = ['id', 'is_premium', 'premium_until', 'email_verified', 'created_at',
                            'telegram_linked', 'telegram_username']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'avatar', 'bio', 'date_of_birth', 'region', 'school']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({'new_password': 'Yangi parollar mos kelmadi'})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Eski parol noto\'g\'ri')
        return value

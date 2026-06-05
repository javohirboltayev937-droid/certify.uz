from rest_framework import serializers
from .models import SubscriptionPlan, Subscription, Payment, PaymeTransaction, ClickTransaction


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'plan_type', 'price_uzs', 'duration_days',
            'description', 'features', 'is_popular', 'discount_percent'
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'plan', 'status', 'start_date', 'end_date', 'auto_renew', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='subscription.plan.name', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'amount', 'payment_method', 'status', 'transaction_id', 'created_at', 'plan_name']


class CreateSubscriptionSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=[
        'payme', 'click', 'uzcard', 'humo', 'stripe', 'cash'
    ])


class PaymentDetailSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='subscription.plan.name', read_only=True)
    method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'payment_method', 'method_display',
            'status', 'status_display', 'transaction_id',
            'provider_transaction_id', 'created_at', 'completed_at', 'plan_name',
        ]

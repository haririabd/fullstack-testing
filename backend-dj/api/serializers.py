from rest_framework import serializers
from .models import Task

# Serializers act as a translator:
# Encoding: Cobverts a Python object into JSON string to send to React
# Decoding: Takes JSON sent by React and turns it into Python object that Django can save

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task # which models need to be translated?
        fields = '__all__'
        # which fields from the model do we wat to include in the JSON?
        # Set explicit field to prevent accidentally expose sensitive data
from django.db import models
import string
import random


def generate_unique_code():
    length = 6

    while True:
        # generate a random uppercase string with length = k
        code = ''.join(random.choices(string.ascii_uppercase, k=length))

        #queries the database to check if the code already exists
        if Room.objects.filter(code=code).count() == 0:
            break
    return code


# Create your models here.
class Room(models.Model):
    # code to access the Room
    code = models.CharField(max_length=8, default="", unique=True)

    # host - room owner
    host = models.CharField(max_length=50, unique=True)

    # is the guest allowed to pause music
    guest_can_pause = models.BooleanField(null=False, default = False)

    # votes needed to skip current track
    votes_to_skip = models.IntegerField(null=False, default=1)

    created_at = models.DateTimeField(auto_now_add=True)

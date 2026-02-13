import random
from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth import get_user_model
from api.models import Board, List, Card, Comment

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates fake data for the application'

    def add_arguments(self, parser):
        parser.add_argument('--users', type=int, help='Number of users to create', default=5)
        parser.add_argument('--boards', type=int, help='Number of boards to create per user', default=2)
        parser.add_argument('--lists', type=int, help='Number of lists to create per board', default=3)
        parser.add_argument('--cards', type=int, help='Number of cards to create per list', default=5)
        parser.add_argument('--comments', type=int, help='Number of comments to create per card', default=2)

    def handle(self, *args, **options):
        fake = Faker()
        num_users = options['users']
        num_boards = options['boards']
        num_lists = options['lists']
        num_cards = options['cards']
        num_comments = options['comments']

        self.stdout.write('Deleting old data...')
        User.objects.exclude(is_superuser=True).delete()
        Board.objects.all().delete()
        # Lists, Cards, and Comments will be cascade-deleted.

        self.stdout.write('Creating new data...')

        users = []
        for _ in range(num_users):
            user = User.objects.create_user(username=fake.user_name(), password='password123')
            users.append(user)
        self.stdout.write(f'{len(users)} users created.')

        boards = []
        for user in users:
            for _ in range(num_boards):
                board = Board.objects.create(
                    owner=user,
                    name=fake.catch_phrase()
                )
                boards.append(board)
        self.stdout.write(f'{len(boards)} boards created.')

        lists = []
        for board in boards:
            for i in range(num_lists):
                list_obj = List.objects.create(
                    board=board,
                    name=fake.word().capitalize(),
                    order=i
                )
                lists.append(list_obj)
        self.stdout.write(f'{len(lists)} lists created.')

        cards = []
        for list_obj in lists:
            for i in range(num_cards):
                card = Card.objects.create(
                    list=list_obj,
                    name=fake.sentence(nb_words=4),
                    description=fake.text(),
                    order=i
                )
                cards.append(card)
        self.stdout.write(f'{len(cards)} cards created.')
        
        comments = []
        for card in cards:
            # Get a random subset of users to be comment authors
            commenting_users = random.sample(users, k=random.randint(1, len(users)))
            for _ in range(num_comments):
                comment = Comment.objects.create(
                    card=card,
                    author=random.choice(commenting_users),
                    text=fake.paragraph(nb_sentences=3)
                )
                comments.append(comment)
        self.stdout.write(f'{len(comments)} comments created.')

        self.stdout.write(self.style.SUCCESS('Successfully created fake data.'))

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Board, List, Card, Comment

User = get_user_model()

class TrelloCloneAPITests(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')

        # Authenticate user1
        self.client.force_authenticate(user=self.user1)

        # Create a board for user1
        self.board1 = Board.objects.create(owner=self.user1, name='User 1 Board')

        # Create a list for the board
        self.list1 = List.objects.create(board=self.board1, name='To Do', order=0)

        # Create a card for the list
        self.card1 = Card.objects.create(list=self.list1, name='Card 1', description='Description', order=0)
        self.card2 = Card.objects.create(list=self.list1, name='Card 2', description='Description', order=1)
        self.card3 = Card.objects.create(list=self.list1, name='Card 3', description='Description', order=2)

        # Create a second list for moving cards
        self.list2 = List.objects.create(board=self.board1, name='Done', order=1)
        # Add a card to list2 to test ordering
        self.card4 = Card.objects.create(list=self.list2, name='Card 4', description='In another list', order=0)


    def test_create_board(self):
        """
        Ensure we can create a new board.
        """
        url = '/api/boards/'
        data = {'name': 'New Board'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Board.objects.count(), 2)
        # Check that the owner is correctly set to the authenticated user
        new_board = Board.objects.get(id=response.data['id'])
        self.assertEqual(new_board.owner, self.user1)

    def test_get_boards(self):
        """
        Ensure we can retrieve a list of boards.
        """
        url = '/api/boards/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_list(self):
        """
        Ensure we can create a new list in a board.
        """
        url = '/api/lists/'
        data = {'name': 'In Progress', 'board': self.board1.id, 'order': 1}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(List.objects.count(), 3)

    def test_create_card(self):
        """
        Ensure we can create a new card in a list.
        """
        url = '/api/cards/'
        data = {'name': 'Card 2', 'list': self.list1.id, 'order': 1}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Card.objects.count(), 5)

    def test_create_comment(self):
        """
        Ensure we can create a new comment on a card.
        """
        url = '/api/comments/'
        data = {'text': 'This is a comment.', 'card': self.card1.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        # Check that the author is correctly set
        new_comment = Comment.objects.get(id=response.data['id'])
        self.assertEqual(new_comment.author, self.user1)

    def test_unauthenticated_user_cannot_create(self):
        """
        Ensure unauthenticated users cannot create objects.
        """
        self.client.force_authenticate(user=None)
        url = '/api/boards/'
        data = {'name': 'Should Fail'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_modify_other_users_board(self):
        """
        Ensure a user cannot modify a board they don't own.
        """
        # Authenticate as user2
        self.client.force_authenticate(user=self.user2)
        url = f'/api/boards/{self.board1.id}/'
        data = {'name': 'Updated by User 2'}
        response = self.client.put(url, data, format='json')
        # We expect a 404 because the default queryset only shows user's own boards
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_card_and_list_deletion_cascades(self):
        """
        Ensure that deleting a list cascades to cards, and deleting a board cascades to lists.
        """
        # Delete the board
        url = f'/api/boards/{self.board1.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Board.objects.count(), 0)
        self.assertEqual(List.objects.count(), 0)
        self.assertEqual(Card.objects.count(), 0)

    def test_move_card_to_another_list(self):
        """
        Ensure we can move a card to another list.
        """
        self.client.force_authenticate(user=self.user1)
        url = f'/api/cards/{self.card1.id}/'
        data = {'list': self.list2.id}
        response = self.client.patch(url, data, format='json')

        # Check response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh the card instance from the database
        self.card1.refresh_from_db()

        # Check if the card's list has been updated
        self.assertEqual(self.card1.list, self.list2)

    def test_reorder_card(self):
        """
        Ensure we can change the order of a card.
        """
        self.client.force_authenticate(user=self.user1)
        # Change card1's order to 2
        url1 = f'/api/cards/{self.card1.id}/'
        data1 = {'order': 2}
        response1 = self.client.patch(url1, data1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        # Refresh from db and check
        self.card1.refresh_from_db()
        self.assertEqual(self.card1.order, 2)

        # Change card2's order
        url2 = f'/api/cards/{self.card2.id}/'
        data2 = {'order': 0}
        response2 = self.client.patch(url2, data2, format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        self.card2.refresh_from_db()
        self.assertEqual(self.card2.order, 0)

    def test_move_card_to_new_position(self):
        """
        Ensure we can move a card to a new position and other cards shift correctly.
        """
        self.client.force_authenticate(user=self.user1)

        # Move card3 (order 2) to the top (order 0)
        url = f'/api/cards/{self.card3.id}/move/'
        data = {'order': 0}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh all cards from the database
        self.card1.refresh_from_db()
        self.card2.refresh_from_db()
        self.card3.refresh_from_db()

        # Check the new world order
        self.assertEqual(self.card3.order, 0, "Card 3 should be at the top")
        self.assertEqual(self.card1.order, 1, "Card 1 should have shifted down to 1")
        self.assertEqual(self.card2.order, 2, "Card 2 should have shifted down to 2")

    def test_move_card_to_different_list_with_move_action(self):
        """
        Ensure the move action can move a card to a different list and reorder correctly.
        """
        # Move card1 (from list1, order 0) to list2 at order 0
        url = f'/api/cards/{self.card1.id}/move/'
        data = {'order': 0, 'list_id': self.list2.id}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh all affected cards
        self.card1.refresh_from_db()
        self.card2.refresh_from_db()
        self.card3.refresh_from_db()
        self.card4.refresh_from_db()

        # Check card1's new state
        self.assertEqual(self.card1.list, self.list2)
        self.assertEqual(self.card1.order, 0)

        # Check if original list (list1) was reordered
        self.assertEqual(self.card2.order, 0)
        self.assertEqual(self.card3.order, 1)

        # Check if new list (list2) was reordered
        self.assertEqual(self.card4.order, 1)
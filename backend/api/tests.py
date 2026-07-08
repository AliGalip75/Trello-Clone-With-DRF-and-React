from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Workspace, Board, List, Card, Comment

User = get_user_model()


class WorkspaceAPITests(APITestCase):
    """Tests for Workspace CRUD operations."""

    def setUp(self):
        self.user1 = User.objects.create_user(email='user1@test.com', username='user1', password='password123')
        self.user2 = User.objects.create_user(email='user2@test.com', username='user2', password='password123')
        self.client.force_authenticate(user=self.user1)

        # Create a workspace for user1
        self.workspace1 = Workspace.objects.create(owner=self.user1, name='User1 Workspace')

    def test_create_workspace(self):
        """Ensure we can create a new workspace and the owner is set automatically."""
        url = '/api/workspaces/'
        data = {'name': 'My New Workspace', 'description': 'A test workspace'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Workspace.objects.count(), 2)
        new_ws = Workspace.objects.get(id=response.data['id'])
        self.assertEqual(new_ws.owner, self.user1)

    def test_get_workspaces_only_returns_own(self):
        """Ensure a user only sees workspaces they own or are a member of."""
        # Create a workspace for user2 (user1 should NOT see this)
        Workspace.objects.create(owner=self.user2, name='User2 Workspace')
        url = '/api/workspaces/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_workspace_member_can_access_workspace(self):
        """Ensure a workspace member can see the workspace in their list."""
        self.workspace1.members.add(self.user2)
        self.client.force_authenticate(user=self.user2)
        url = '/api/workspaces/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'User1 Workspace')

    def test_workspace_member_can_access_boards(self):
        """Ensure a workspace member (Seçenek A) can access all boards in that workspace."""
        board = Board.objects.create(
            workspace=self.workspace1, owner=self.user1, name='Shared Board'
        )
        # Add user2 as workspace member — they should now see the board
        self.workspace1.members.add(self.user2)
        self.client.force_authenticate(user=self.user2)
        url = '/api/boards/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Shared Board')

    def test_non_member_cannot_access_workspace(self):
        """Ensure a user cannot see or modify a workspace they don't belong to."""
        self.client.force_authenticate(user=self.user2)
        url = f'/api/workspaces/{self.workspace1.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_workspace_cascades_to_boards(self):
        """Ensure deleting a workspace cascades to all boards, lists, and cards."""
        board = Board.objects.create(workspace=self.workspace1, owner=self.user1, name='Board')
        lst = List.objects.create(board=board, name='To Do', order=0)
        Card.objects.create(list=lst, name='Card 1', order=0)

        url = f'/api/workspaces/{self.workspace1.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Workspace.objects.count(), 0)
        self.assertEqual(Board.objects.count(), 0)
        self.assertEqual(List.objects.count(), 0)
        self.assertEqual(Card.objects.count(), 0)


class TrelloCloneAPITests(APITestCase):
    """Tests for Board, List, Card, and Comment operations."""

    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(email='user1@test.com', username='user1', password='password123')
        self.user2 = User.objects.create_user(email='user2@test.com', username='user2', password='password123')

        # Authenticate user1
        self.client.force_authenticate(user=self.user1)

        # Every board now requires a workspace — create one first
        self.workspace1 = Workspace.objects.create(owner=self.user1, name='User1 Workspace')

        # Create a board inside the workspace
        self.board1 = Board.objects.create(
            workspace=self.workspace1, owner=self.user1, name='User 1 Board'
        )

        # Create a list for the board
        self.list1 = List.objects.create(board=self.board1, name='To Do', order=0)

        # Create cards for the list
        self.card1 = Card.objects.create(list=self.list1, name='Card 1', description='Description', order=0)
        self.card2 = Card.objects.create(list=self.list1, name='Card 2', description='Description', order=1)
        self.card3 = Card.objects.create(list=self.list1, name='Card 3', description='Description', order=2)

        # Create a second list for moving cards
        self.list2 = List.objects.create(board=self.board1, name='Done', order=1)
        # Add a card to list2 to test ordering
        self.card4 = Card.objects.create(list=self.list2, name='Card 4', description='In another list', order=0)

    def test_create_board(self):
        """Ensure we can create a new board inside a workspace."""
        url = '/api/boards/'
        data = {'name': 'New Board', 'workspace': self.workspace1.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Board.objects.count(), 2)
        # Check that the owner is correctly set to the authenticated user
        new_board = Board.objects.get(id=response.data['id'])
        self.assertEqual(new_board.owner, self.user1)
        self.assertEqual(new_board.workspace, self.workspace1)

    def test_get_boards(self):
        """Ensure we can retrieve a list of boards."""
        url = '/api/boards/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_list(self):
        """Ensure we can create a new list in a board."""
        url = '/api/lists/'
        data = {'name': 'In Progress', 'board': self.board1.id, 'order': 2}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(List.objects.count(), 3)

    def test_create_card(self):
        """Ensure we can create a new card in a list."""
        url = '/api/cards/'
        data = {'name': 'Card 5', 'list_id': self.list1.id, 'order': 3}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Card.objects.count(), 5)

    def test_create_comment(self):
        """Ensure we can create a new comment on a card."""
        url = '/api/comments/'
        data = {'text': 'This is a comment.', 'card': self.card1.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        # Check that the author is correctly set
        new_comment = Comment.objects.get(id=response.data['id'])
        self.assertEqual(new_comment.author, self.user1)

    def test_unauthenticated_user_cannot_create(self):
        """Ensure unauthenticated users cannot create objects.
        JWT auth returns 401 Unauthorized (not 403) for unauthenticated requests.
        """
        self.client.force_authenticate(user=None)
        url = '/api/boards/'
        data = {'name': 'Should Fail', 'workspace': self.workspace1.id}
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_user_cannot_modify_other_users_board(self):
        """Ensure a user cannot modify a board they don't own or have access to."""
        # Authenticate as user2
        self.client.force_authenticate(user=self.user2)
        url = f'/api/boards/{self.board1.id}/'
        data = {'name': 'Updated by User 2', 'workspace': self.workspace1.id}
        response = self.client.put(url, data, format='json')
        # We expect a 404 because the queryset filters out boards the user has no access to
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_card_and_list_deletion_cascades(self):
        """Ensure that deleting a board cascades to lists and cards."""
        url = f'/api/boards/{self.board1.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Board.objects.count(), 0)
        self.assertEqual(List.objects.count(), 0)
        self.assertEqual(Card.objects.count(), 0)

    def test_move_card_to_another_list(self):
        """Ensure we can move a card to another list via the move action."""
        self.client.force_authenticate(user=self.user1)
        url = f'/api/cards/{self.card1.id}/move/'
        # Move card1 from list1 to list2 at the end (order 1 because card4 is at 0)
        data = {'list_id': self.list2.id, 'order': 1}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.card1.refresh_from_db()
        self.assertEqual(self.card1.list, self.list2)

    def test_reorder_card(self):
        """Ensure we can change the order of a card via the move action."""
        self.client.force_authenticate(user=self.user1)
        # Move card1 (order 0) to order 2
        url1 = f'/api/cards/{self.card1.id}/move/'
        data1 = {'order': 2}
        response1 = self.client.post(url1, data1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.card1.refresh_from_db()
        self.assertEqual(self.card1.order, 2)

        # Move card3 (now at order 1 after above shift) to order 0
        url2 = f'/api/cards/{self.card3.id}/move/'
        data2 = {'order': 0}
        response2 = self.client.post(url2, data2, format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.card3.refresh_from_db()
        self.assertEqual(self.card3.order, 0)

    def test_move_card_to_new_position(self):
        """Ensure we can move a card to a new position and other cards shift correctly."""
        self.client.force_authenticate(user=self.user1)
        url = f'/api/cards/{self.card3.id}/move/'
        data = {'order': 0}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.card1.refresh_from_db()
        self.card2.refresh_from_db()
        self.card3.refresh_from_db()

        self.assertEqual(self.card3.order, 0, "Card 3 should be at the top")
        self.assertEqual(self.card1.order, 1, "Card 1 should have shifted down to 1")
        self.assertEqual(self.card2.order, 2, "Card 2 should have shifted down to 2")

    def test_move_card_to_different_list_with_move_action(self):
        """Ensure the move action can move a card to a different list and reorder correctly."""
        url = f'/api/cards/{self.card1.id}/move/'
        data = {'order': 0, 'list_id': self.list2.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.card1.refresh_from_db()
        self.card2.refresh_from_db()
        self.card3.refresh_from_db()
        self.card4.refresh_from_db()

        self.assertEqual(self.card1.list, self.list2)
        self.assertEqual(self.card1.order, 0)
        self.assertEqual(self.card2.order, 0)
        self.assertEqual(self.card3.order, 1)
        self.assertEqual(self.card4.order, 1)
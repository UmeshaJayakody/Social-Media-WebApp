"""empty message

Revision ID: 50b973ac4271
Revises: 7e262965d77e
Create Date: 2025-01-18 16:28:47.484916

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '50b973ac4271'
down_revision: Union[str, None] = '7e262965d77e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'chats',
        sa.Column('id', sa.Integer, primary_key=True , autoincrement=True),
        sa.Column('to_id', sa.Integer, nullable=False ),
        sa.Column('from_id', sa.Integer, nullable=False ),
        sa.Column('content', sa.String(255), nullable=False ),
        sa.ForeignKeyConstraint(['to_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['from_id'], ['users.id'], ondelete='CASCADE'),
        )


def downgrade() -> None:
    op.drop_table('chats')
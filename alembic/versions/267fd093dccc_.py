"""empty message

Revision ID: 267fd093dccc
Revises: 50b973ac4271
Create Date: 2025-01-18 16:31:35.551756

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '267fd093dccc'
down_revision: Union[str, None] = '50b973ac4271'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('chats', sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False))
    pass


def downgrade() -> None:
    op.drop_column('chats', 'created_at')
    pass

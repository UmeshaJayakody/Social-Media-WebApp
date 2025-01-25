"""empty message

Revision ID: bbf99acfbb51
Revises: e322dfcffa7e
Create Date: 2025-01-14 18:25:54.542157

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bbf99acfbb51'
down_revision: Union[str, None] = 'e322dfcffa7e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer, primary_key=True , autoincrement=True),
        sa.Column('title', sa.String(255), nullable=False ),
        sa.Column('content', sa.String(255), nullable=False ),
        sa.Column('published', sa.Boolean, server_default='1', nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False)
        )
    pass


def downgrade() -> None:
    op.drop_table('posts')
    pass

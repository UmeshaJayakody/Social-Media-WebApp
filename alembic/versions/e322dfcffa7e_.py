"""empty message

Revision ID: e322dfcffa7e
Revises: 8fc6d9cf381f
Create Date: 2025-01-14 14:30:27.117237

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e322dfcffa7e'
down_revision: Union[str, None] = '8fc6d9cf381f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('posts', sa.Column('content_linkd', sa.String(255), nullable=True))
    pass


def downgrade() -> None:
    op.drop_column('posts', 'content_linkd')
    pass

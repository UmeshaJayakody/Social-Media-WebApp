"""empty message

Revision ID: 94db6e8473b5
Revises: d906286661ae
Create Date: 2025-01-14 18:30:51.463903

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94db6e8473b5'
down_revision: Union[str, None] = 'd906286661ae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('posts', sa.Column('content_linkd', sa.String(255), nullable=True))
    pass


def downgrade() -> None:
    op.drop_column('posts', 'content_linkd')
    pass

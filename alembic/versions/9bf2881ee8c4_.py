"""empty message

Revision ID: 9bf2881ee8c4
Revises: 68ef961d018b
Create Date: 2025-01-18 16:25:42.700199

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9bf2881ee8c4'
down_revision: Union[str, None] = '68ef961d018b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table('massages')
    pass


def downgrade() -> None:
    pass

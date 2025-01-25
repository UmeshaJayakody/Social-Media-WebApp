"""empty message

Revision ID: 7e262965d77e
Revises: 9bf2881ee8c4
Create Date: 2025-01-18 16:27:33.386882

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e262965d77e'
down_revision: Union[str, None] = '9bf2881ee8c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

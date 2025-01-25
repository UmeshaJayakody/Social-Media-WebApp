"""empty message

Revision ID: 1a12cf262113
Revises: a6626ff13558
Create Date: 2024-12-27 18:26:22.410812

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a12cf262113'
down_revision: Union[str, None] = 'a6626ff13558'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

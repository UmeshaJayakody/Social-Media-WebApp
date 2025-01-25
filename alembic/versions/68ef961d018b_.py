"""empty message

Revision ID: 68ef961d018b
Revises: 527766cfa71e
Create Date: 2025-01-18 16:24:21.606070

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '68ef961d018b'
down_revision: Union[str, None] = '527766cfa71e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table('massage')

def downgrade() -> None:
    pass

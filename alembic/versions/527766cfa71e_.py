"""empty message

Revision ID: 527766cfa71e
Revises: c4dbcc174d91
Create Date: 2025-01-18 16:22:53.434855

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '527766cfa71e'
down_revision: Union[str, None] = 'c4dbcc174d91'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'massages',
        sa.Column('id', sa.Integer, primary_key=True , autoincrement=True),
        sa.Column('to', sa.Integer, nullable=False ),
        sa.Column('from', sa.Integer, nullable=False ),
        sa.Column('content', sa.String(255), nullable=False ),
        sa.ForeignKeyConstraint(['to'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['from'], ['users.id'], ondelete='CASCADE'),
        )


def downgrade() -> None:
    op.drop_table('massage')
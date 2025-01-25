"""empty message

Revision ID: c4dbcc174d91
Revises: f1fe1ce2d8d7
Create Date: 2025-01-18 15:58:44.859565

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4dbcc174d91'
down_revision: Union[str, None] = 'f1fe1ce2d8d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'massage',
        sa.Column('id', sa.Integer, primary_key=True , autoincrement=True),
        sa.Column('to', sa.Integer, nullable=False ),
        sa.Column('from', sa.Integer, nullable=False ),
        sa.Column('massage', sa.String(255), nullable=False ),
        sa.ForeignKeyConstraint(['to'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['from'], ['users.id'], ondelete='CASCADE'),
        )


def downgrade() -> None:
    op.drop_table('massage')
    

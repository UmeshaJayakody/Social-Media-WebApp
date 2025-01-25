"""empty message

Revision ID: 08dd3ba002b5
Revises: 267fd093dccc
Create Date: 2025-01-24 16:29:29.183098

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '08dd3ba002b5'
down_revision: Union[str, None] = '267fd093dccc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'alternatives',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('profile_photo', sa.String(255), server_default='default_dp.jpg', nullable=False),
        sa.Column('background_photo)', sa.String(255),server_default='default_background.jpg', nullable=False),
        sa.Column('introduction', sa.String(255), nullable = True ),
        sa.Column('contact_number', sa.String(255), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('address',sa.String(255), nullable=True),
        sa.Column('birthday', sa.DateTime, nullable=True),
        sa.Column('social_media_link_1', sa.String(255), nullable=True),
        sa.Column('social_media_link_2', sa.String(255), nullable=True),
        sa.Column('social_media_link_3', sa.String(255), nullable=True),
        sa.ForeignKeyConstraint(['id'], ['users.id'], ondelete='CASCADE')
        )


def downgrade() -> None:
    op.drop_table('alternatives')

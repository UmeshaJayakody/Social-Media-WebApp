"""empty message

Revision ID: 09b3d9dd9f46
Revises: 7fb841d8f2d9
Create Date: 2025-01-24 17:31:29.523633

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '09b3d9dd9f46'
down_revision: Union[str, None] = '7fb841d8f2d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'alternative_infomations',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('profile_photo', sa.String(255), server_default='default_dp.jpg', nullable=False),
        sa.Column('background_photo', sa.String(255),server_default='default_background.jpg', nullable=False),
        sa.Column('introduction', sa.String(255),server_default="None", nullable = False ),
        sa.Column('contact_number', sa.String(255), server_default="None", nullable = False ),
        sa.Column('address',sa.String(255), server_default="None", nullable = False ),
        sa.Column('birthday', sa.String(255), server_default="None", nullable = False ),
        sa.Column('social_media_link_1',sa.String(255), server_default="None", nullable = False ),
        sa.Column('social_media_link_2',sa.String(255), server_default="None", nullable = False ),
        sa.Column('social_media_link_3',sa.String(255), server_default="None", nullable = False ),
        sa.ForeignKeyConstraint(['id'], ['users.id'], ondelete='CASCADE')
        )

def downgrade() -> None:
    op.drop_table('alternative_informations')

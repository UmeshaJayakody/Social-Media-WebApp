"""empty message

Revision ID: 590139c64ee0
Revises: 05b97cdcb065
Create Date: 2025-01-14 18:29:22.588930

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '590139c64ee0'
down_revision: Union[str, None] = '05b97cdcb065'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('posts', sa.Column('owner_id', sa.Integer(), nullable=False))
    op.create_foreign_key('post_users_fk', source_table='posts',referent_table= 'users',local_cols= ['owner_id'],remote_cols= ['id'], ondelete='CASCADE')
    pass

def downgrade() -> None:
    op.drop_constraint('post_users_fk', 'posts', type_='foreignkey')
    op.drop_column('posts', 'owner_id')
    pass

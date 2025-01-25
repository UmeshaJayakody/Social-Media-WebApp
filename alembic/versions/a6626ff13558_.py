"""empty message

Revision ID: a6626ff13558
Revises: 0e2606609847
Create Date: 2024-12-27 18:04:03.535496

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a6626ff13558'
down_revision: Union[str, None] = '0e2606609847'
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

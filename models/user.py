from utils.database import get_users


class User:

    @staticmethod
    def login(username, password):

        conn = get_users()

        user = conn.execute(

        """
        SELECT * FROM users
        WHERE username=?
        AND password=?

        """,

        (username, password)

        ).fetchone()

        conn.close()

        return user


    @staticmethod
    def create(username, password, role="admin"):

        conn = get_users()

        conn.execute(

        """

        INSERT INTO users
        (
        username,
        password,
        role
        )

        VALUES(?,?,?)

        """,

        (username, password, role)

        )

        conn.commit()

        conn.close()


    @staticmethod
    def all():

        conn = get_users()

        users = conn.execute(

        "SELECT * FROM users"

        ).fetchall()

        conn.close()

        return users

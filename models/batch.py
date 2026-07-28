from utils.database import get_batches


class Batch:

    @staticmethod
    def all():
        conn = get_batches()
        data = conn.execute(
            "SELECT * FROM batches ORDER BY id DESC"
        ).fetchall()
        conn.close()
        return data

    @staticmethod
    def get(batch_id):
        conn = get_batches()
        data = conn.execute(
            "SELECT * FROM batches WHERE batch_id=?",
            (batch_id,)
        ).fetchone()
        conn.close()
        return data

    @staticmethod
    def create(data):
        conn = get_batches()

        conn.execute("""
        INSERT INTO batches
        (
        batch_id,
        name,
        category,
        language,
        description,
        thumbnail,
        banner,
        status
        )

        VALUES(?,?,?,?,?,?,?,?)

        """,(

        data["batch_id"],
        data["name"],
        data["category"],
        data["language"],
        data["description"],
        data["thumbnail"],
        data["banner"],
        data["status"]

        ))

        conn.commit()
        conn.close()

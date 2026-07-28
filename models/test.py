from utils.database import get_batches


class Test:

    @staticmethod
    def all():
        conn = get_batches()
        data = conn.execute(
            "SELECT * FROM tests ORDER BY id DESC"
        ).fetchall()
        conn.close()
        return data

    @staticmethod
    def get(test_id):
        conn = get_batches()
        data = conn.execute(
            "SELECT * FROM tests WHERE test_id=?",
            (test_id,)
        ).fetchone()
        conn.close()
        return data

    @staticmethod
    def by_batch(batch_id):
        conn = get_batches()
        data = conn.execute(
            "SELECT * FROM tests WHERE batch_id=?",
            (batch_id,)
        ).fetchall()
        conn.close()
        return data

    @staticmethod
    def by_subject(batch_id, subject_id):
        conn = get_batches()
        data = conn.execute(
            "SELECT * FROM tests WHERE batch_id=? AND subject_id=?",
            (batch_id, subject_id)
        ).fetchall()
        conn.close()
        return data

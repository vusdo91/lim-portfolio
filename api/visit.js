const { admin, getAdminDb } = require('./_lib/firebaseAdmin');

const COOKIE_NAME = 'lim_visit_day';

function getKoreaDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function hasCookie(req, name, value) {
  return (req.headers.cookie || '').split(';').some((cookie) => cookie.trim() === `${name}=${value}`);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const today = getKoreaDate();
  res.setHeader('Cache-Control', 'no-store');
  if (hasCookie(req, COOKIE_NAME, today)) return res.status(200).json({ counted: false });

  try {
    const db = getAdminDb();
    const summaryRef = db.collection('siteStats').doc('visitors');
    const dailyRef = summaryRef.collection('daily').doc(today);
    await db.runTransaction(async (transaction) => {
      transaction.set(summaryRef, { totalVisits: admin.firestore.FieldValue.increment(1), updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      transaction.set(dailyRef, { visits: admin.firestore.FieldValue.increment(1), updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    });
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${today}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax; Secure`);
    return res.status(201).json({ counted: true });
  } catch (error) {
    console.error('Visitor count failed:', error);
    return res.status(500).json({ error: 'Unable to record visit' });
  }
};

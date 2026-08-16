const { getAdminApp, getAdminDb } = require('./_lib/firebaseAdmin');

function getKoreaDate(offset = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offset);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

async function verifyAdmin(req) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return false;
  const decoded = await getAdminApp().auth().verifyIdToken(token);
  return decoded.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    if (!(await verifyAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    const db = getAdminDb();
    const summaryRef = db.collection('siteStats').doc('visitors');
    const days = Array.from({ length: 7 }, (_, index) => getKoreaDate(index - 6));
    const [summary, ...dailySnapshots] = await Promise.all([summaryRef.get(), ...days.map((day) => summaryRef.collection('daily').doc(day).get())]);
    const daily = days.map((date, index) => ({ date, visits: dailySnapshots[index].data()?.visits || 0 }));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      totalVisits: summary.data()?.totalVisits || 0,
      todayVisits: daily[6].visits,
      lastSevenDaysVisits: daily.reduce((sum, day) => sum + day.visits, 0),
      daily
    });
  } catch (error) {
    console.error('Visitor stats failed:', error);
    return res.status(500).json({ error: 'Unable to retrieve visitor stats' });
  }
};

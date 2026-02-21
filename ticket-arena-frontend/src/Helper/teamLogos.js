export const TEAM_LOGOS = {
    rcb: "/Team_logos/RCB.jpg",
    csk: "/Team_logos/CSK.jpg",
    dc: "/Team_logos/Delhi_Capitals.png",
    kkr: "/Team_logos/KKR.png",
    gt: "/Team_logos/GT.jpg",
    mi: "/Team_logos/MI.jpg",
    pbks: "/Team_logos/Pbks.png",
    rr: "/Team_logos/RR.png",
    srh:"/Team_logos/Srh.png",
    lsg:"/Team_logos/Lsg.jpg",

    india: "/Team_logos/India.png",
    pakistan: "/Team_logos/Pak.webp",
    australia: "/Team_logos/Aus.webp",
    england: "/Team_logos/England.png",
    "shri lanka": "/Team_logos/Shri_lanka.jpg",
     bangladesh: "/Team_logos/Bangladesh.jpg",
     canada: "/Team_logos/Canada.png",
    "south africa": "/Team_logos/Southafrica.png",
    "west indies": "/Team_logos/Westindies.png",
    "new zealand": "/Team_logos/Newzealand.png",
     italy: "/Team_logos/Italy.jpg",
     ireland: "/Team_logos/Ireland.png",
  };

  export const cleanTeam = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();

  export const getTeamsFromDescription = (description) => {
    if (!description) return null;
    let parts = description.split(/v\/s|vs|v/i);
    if (parts.length !== 2) return null;

    const rawTeamA = parts[0].trim();
    const rawTeamB = parts[1].trim();

    const keyA = cleanTeam(rawTeamA);
    const keyB = cleanTeam(rawTeamB);

    return {
      teamA: {
        name: rawTeamA,
        logo: TEAM_LOGOS[keyA] || "/default-team.png",
      },
      teamB: {
        name: rawTeamB,
        logo: TEAM_LOGOS[keyB] || "/default-team.png",
      },
    };
  };
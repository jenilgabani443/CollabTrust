export function getCreatorDisplay(creator) {
  const pd = creator?.profileDetails || {};
  const firstName = pd.firstName || '';
  const lastName = pd.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Creator';
  const avatarLetter = (firstName || 'C').charAt(0).toUpperCase();

  return {
    fullName,
    avatarLetter,
    profilePicture: pd.profilePicture || null,
    location: pd.location || 'Unknown',
    niches: pd.niches || [],
    niche: pd.niche,
  };
}

export function creatorAvatarLayoutId(creatorId) {
  return `creator-avatar-${creatorId}`;
}

export function creatorAvatarImageLayoutId(creatorId) {
  return `creator-avatar-img-${creatorId}`;
}

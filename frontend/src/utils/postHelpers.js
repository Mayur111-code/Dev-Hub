export const normalizeLikeIds = (likes = []) =>
  likes.map((l) => (typeof l === "string" ? l : l?._id)).filter(Boolean);

export const normalizeLikedUsers = (likes = [], fallback = []) => {
  const users = likes.filter((l) => typeof l === "object" && l?._id);
  return users.length ? users : fallback;
};

export const isPostLiked = (likes = [], userId) =>
  normalizeLikeIds(likes).includes(userId);

const { axios } = require("./fakeBackend/mock");

const test = (arr) => {
  const newArr = [];
  arr.forEach(async (it) => {
    const response = await axios.get(`/users?id=${it.userId}`);
    const user = response.data.users[0];

    if (user.name) {
      newArr.push({
        user: `${user.name} (${user.email})`,
        message: it.message,
        date: it.date,
      });
    }
  });

  return newArr;
};

const getFeedbackByProductViewData = async (product, actualize = false) => {
  try {
    const res = await axios(`/feedback?product=${product}`);
    const feedbacks = res.data.feedback;

    let finalFeedbacks = [];

    feedbacks.sort((a, b) => {
      return a.date - b.date;
    });

    if (feedbacks.length === 0) return new Promise((resolve) => resolve({ message: "Отзывов пока нет" }));

    feedbacks.forEach((it) => {
      const newDate = new Date(it.date);
      it.date = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
    });

    finalFeedbacks = await test(feedbacks);

    return new Promise((resolve) => resolve({ feedback: finalFeedbacks }));
  } catch (err) {
    return new Promise((resolve) => resolve({ message: "Такого продукта не существует" }));
  }
};

module.exports = { getFeedbackByProductViewData };

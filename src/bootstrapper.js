const bootstrapper = {};

bootstrapper.setData = (payload) => {
    _.extend(bootstrapper, _.omit(payload, 'user', 'csrf_token'));
};

export default bootstrapper;

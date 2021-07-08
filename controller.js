const User = require('./model')
const session = require('express-session')


exports.register = async (req, res) => {
 const user = new User({
  name: req.body.name,
  email: req.body.email,
  password: req.body.password
 })

 await user
  .save()
  .then(() => {
   res.redirect('/')
  })
  .catch((error) => {
   res.render('./register/400', {
    title: 'Karvon', layout: './layout',
   })
  })


}

exports.getAll = async (req, res) => {
  const user = await User.find()
    .sort({ date: -1 })
  res.render('./list', { title: 'Admin', layout: './layout', user})
}

exports.getById = async (req, res) => {
  const user = await User.findById({ _id: req.params.id })
  
  res.render('./edit', { title: 'Admin', layout: './layout', user})
  
}
exports.updateOne = async (req, res) => {
  const user = await User.findByIdAndUpdate({_id: req.params.id})

  if (!user) {
    res.render('./register/400', {
      title: 'Karvon', layout: './layout',
     })
  }

  user.name = req.body.name;
  user.email = req.body.email;

  await user.save()
    .then(() => {
    res.redirect('/api/all')
    })
    .catch((error) => {
      res.render('./register/400', {
        title: 'Karvon', layout: './layout',
       })
  })
  
}

exports.getByIdDelete = async (req, res) => {
  await User.findByIdAndDelete({ _id: req.params.id })
  res.redirect('/api/all')
}


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Parolni solishtirish
  if (!email || !password) {
      res.redirect('/')
  }
  const users = await User.findOne({ email: email }).select('password');
  if (!users) {
      res.redirect('/')
  }
  const isMatch = await users.matchPassword(password);
  if (!isMatch) {
      res.redirect('/');
  }

  // Avtorizatsiyadan o'tgan paytda sessiya paydo boladi, ungacha ko'rinmaydi
  const body = await User.findOne({ email: req.body.email })
  req.session.valijon = body
  req.session.save()
  
  console.log(req.session)


  req.session.isAuth = true
  res.redirect('/api/all')
}
exports.logOut = async(req, res) => {
  req.session.destroy()
    res.clearCookie('connect.sid')
    res.redirect('/')
}

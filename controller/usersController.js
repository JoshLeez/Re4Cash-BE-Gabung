// membuat fungsi yang akan diambil oleh routes nya
require("dotenv").config();
const usersModel = require("../model/users")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
   try {
      const data = await usersModel.getAllUsers();

      res.status(200).json({
         message : "GET all users succes",
         data : data
      })
   } catch (error) {
      res.status(500).json({
         message : "Server eror",
         serverMessage : error
   })
   }
}

const register = async (req, res) => {
   const {fullname, email, password, confirm_password } = req.body
   const {body} = req

   if(password !== confirm_password) return res.status.json({message : "password tidak cocok"})

   const salt = await bcrypt.genSalt();
   const hashPassword = await bcrypt.hash(password, salt)
   
   try {
      await usersModel.register({
         fullname : fullname,
         email : email,
         password : hashPassword
      })

      res.satatus(201).json({
         message : "Anda berhasil mendaftar berhasil",
         data : body
      })
   } catch (error) {
      res.status(500).json({
         message : "Server eror",
         serverMessage : error
      })
   }
}

const login = async (req, res) => {
   try {
      const {body} = req
      const user = await usersModel.getEmailUser(body)

      const match = await bcrypt.compare(req.body.password, user[0].password)

      if(!match) return res.status(400).json({
         message : "password anda salah"
      })
      
      const userId = user[0].id_user
      const email = user[0].email
      const usersToken = jwt.sign({userId, email}, `${process.env.USERS_TOKEN}`)

      await usersModel.tokenUsers({
         refresh_token : usersToken
         }, userId
      )

      res.json({
         authorization: `bearer ${usersToken}`
      })
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message : "email tidak ditemukan",
      })
   }
}

const logout = async (req, res) => {
   const userId = req.user.userId

   await usersModel.tokenUsers({
      refresh_token : null
   }, userId)

   res.json({
      message : "anda telah logout"
   })
}

const updateUser = async (req,res) => {
   const id_user = req.user.userId
   const {body} = req
   try {
      await usersModel.updateUsers(body, id_user)

      res.status(201).json({
         message : "UPDATE users succes",
         data : {
            id_user : id_user,
            ...body
         }
      })
   } catch (error) {
      res.status(500).json({
         message : "Server eror",
         serverMessage : error
      })
   }
}

module.exports = {
   getAllUsers,
   register,
   login,
   logout,
   updateUser
}
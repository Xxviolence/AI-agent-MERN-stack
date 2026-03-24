const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '请输入用户名'],
      unique: true,
      trim: true,
      minlength: [2, '用户名至少2个字符'],
      maxlength: [20, '用户名最多20个字符'],
    },
    email: {
      type: String,
      required: [true, '请输入邮箱'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '请输入密码'],
      minlength: [6, '密码至少6个字符'],
      select: false, // 查询时默认不返回密码
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// 保存前哈希密码
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 校验密码方法
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

 import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema (
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            minLength: [5, 'Username must be at least 5 characters'],
            maxLength: [20, 'Username must be less than 20 characters'],
            unique: true,
            validate: {
                validator: function(v) {
                return validator.isAlphanumeric(v);
                },
                message: props => `Username ${props.value} should contain only letters and numbers`
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            validate: {
                validator: function(v) {
                return validator.isStrongPassword(v, {
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                });
                },
                message: 'Password is not strong enough'
            },
            select: false
        },
        role: {
            type: String,
            default: 'admin'
        },
        schoolID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School'
        }
    },
    { timestamps: true }
);

AdminSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

AdminSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

export default mongoose.model("Admin", AdminSchema);

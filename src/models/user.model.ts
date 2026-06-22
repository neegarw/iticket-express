import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db";

export interface UserAttributes {
    id: number;
    name: string;
    surname: string;
    bio?: string;
    email: string;
    phone?: string;
    password?: string;
    googleId?: string;
    isVerified: boolean;
    otp?: string;
    otpExpiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "id" | "bio" | "phone" | "password" | "googleId" | "isVerified" | "otp" | "otpExpiresAt"> { }

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public surname!: string;
    public bio!: string;
    public email!: string;
    public phone!: string;
    public password!: string;
    public googleId!: string;
    public isVerified!: boolean;
    public otp!: string;
    public otpExpiresAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(plain: string): Promise<boolean> {
        if (!this.password) return false;
        return bcrypt.compare(plain, this.password);
    }

    public toSafeJSON(): Omit<UserAttributes, "password" | "otp" | "otpExpiresAt" | "googleId"> {
        return {
            id: this.id,
            name: this.name,
            surname: this.surname,
            bio: this.bio,
            email: this.email,
            phone: this.phone,
            isVerified: this.isVerified,
        };
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        bio: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        phone: {
            type: DataTypes.BIGINT, 
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,   // null for OAuth users
        },
        googleId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        otp: {
            type: DataTypes.STRING(6),
            allowNull: true,
        },
        otpExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "users",
        modelName: "User",
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed("password") && user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
        },
    }
);

export default User;

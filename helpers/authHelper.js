import bcrypt from 'bcrypt'
export const hashPassword =async(password)=>{
    try{

        const saltRound=10;
        const hashPassword=await bcrypt.hash(password,saltRound);
        return hashPassword;
    }
    catch(err){
        console.log(err)
    }
}
export const comparePassword=async(password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword)

}
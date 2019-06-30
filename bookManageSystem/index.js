const express = require("express");
const url = require("url");
const fs = require("fs");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const session = require('express-session');
const formidable = require("formidable");
const path = require('path');
const router = express.Router();
const app = express();
let port = 2333;
let hostname = "127.0.0.1";
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

app.use(session({
    resave : true,
    saveUninitialized: false,
    cookie : { maxAge : 1000 * 60 * 60}
}));

var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'bookmanagementsystem'
});
pool.getConnection(function (err,connection) {
//注册
    app.get("/register",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let name = query.name;
        let id = query.id;
        let password = query.password;
        let tel = query.tel;
        let addSql = 'INSERT INTO user(uname,schoolNum,tel,password) VALUES(?,?,?,?)';
        let addSqlParams = [name, id, tel, password];
        let info = new Object();
       
            connection.query(addSql,addSqlParams,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = "注册失败";
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    info.code = 200;
                    info.message = "注册成功";
                    console.log('INSERT ID:',result);
                }
                res.send(JSON.stringify(info));
                return ;
            });
    });
//登入
    app.get("/login",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let password = query.password;

        req.session.id = query.id;

        let info = new Object();
        let sql = 'SELECT * FROM USER WHERE schoolNum = ? AND PASSWORD = ?;';
        let sqlParams = [id,password];
       
            connection.query(sql,sqlParams,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '登入失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    if(result.length == 1){
                        info.code = 200;
                        info.permission = result[0].userPermissions;
                        info.message = "登入成功";
                    }else{
                        info.code = 100;
                        info.message = "信息错误";
                    }
                }
                res.send(JSON.stringify(info));
                return ;
            });
    });
//获取用户信息
    app.get("/getUserInfo",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let info = new Object();
        let borrow = []
        let sql = 'SELECT * FROM USER WHERE schoolNum = ?;';
        let bookUserBorrow = `
        SELECT userborrowbookinfo.*, bookinfo.\`bName\`
        FROM userborrowbookinfo,bookinfo
        WHERE userborrowbookinfo.\`bId\` = bookinfo.\`bid\` AND userborrowbookinfo.\`schoolNum\`=?;
    `;
        let bookUserParams = [id];
        let sqlParams = [id];
       
            connection.query(sql,sqlParams,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '登入失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    if(result.length == 1){
                        connection.query(bookUserBorrow,bookUserParams,function (err, dataBorrow) {
                            if(err){
                                info.code = 105;
                                info.message = '登入失败';
                                console.log('[INSERT ERROR] - ',err.message);
                            }else{
                                for (let i = 0;i < dataBorrow.length; i++){
                                    borrow.push(dataBorrow[i]);
                                }
                                let findInfo = result[0];
                                info.code = 200;
                                let data = new Object();
                                data.uname = findInfo.uname;
                                data.id = findInfo.schoolNum;
                                data.tel = findInfo.tel;
                                data.password = findInfo.password;
                                data.nickName = findInfo.nickName;
                                data.signature = findInfo.signature;
                                data.avatar = findInfo.avatar;
                                info.data = data;
                                info.message = "登入成功";
                                info.borrowInfo = borrow;
                                res.send(JSON.stringify(info));
                                return ;
                            }
                        });
                    }
                }
            });
    });
//更改用户信息
    app.get("/changUserInfo",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let tel = query.tel;
        let password = query.password;
        let modSql = 'UPDATE user SET tel = ?,password = ? WHERE schoolNum = ?';
        let sqlParams = [tel, password, id];
        let info = new Object();
       
            connection.query(modSql,sqlParams,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '修改失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    info.code = 200;
                    info.message = '修改成功';
                }
                res.send(JSON.stringify(info));
                return ;
            })
    });
//修改用户昵称和签名
    app.get("/changeNickSig",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let nickName = query.nickName;
        let signature = query.signature;
        let modSql = 'UPDATE user SET nickName = ?,signature = ? WHERE schoolNum = ?';
        let sqlParams = [nickName, signature, id];
        let info = new Object();
       
            connection.query(modSql,sqlParams,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '修改失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    info.code = 200;
                    info.message = '修改成功';
                }
                res.send(JSON.stringify(info));
                return ;
            })
    });
//上传用户头像
    app.post("/uplodeAvatar/:uid",function (req,res,next) {
        let uid = req.params.uid;
        let info = new Object();
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '/public/images');
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.keepExtensions = true;
        form.parse(req, function (err, fields, file) {
            var filePath = '';
            if (file.tmpFile) {
                filePath = file.tmpFile.path;
            } else {
                for (let key in file) {
                    if (file[key].path && filePath === '') {
                        filePath = file[key].path;
                        break;
                    }
                }
            }
            let targetDir = path.join(__dirname, '/public/images');
            if (!fs.existsSync(targetDir)) {
                fs.mkdir(targetDir);
            }
            let fileExt = filePath.substring(filePath.lastIndexOf('.'));
            if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                var err = new Error('此文件类型不允许上传');
                info.code = 105;
                info.message = "文件格式不正确";
            } else {
                var fileName = uid + fileExt;
                var targetFile = path.join(targetDir, fileName);
                //移动文件
                fs.rename(filePath, targetFile, function (err) {
                    if (err) {
                        console.info(err);
                        info.code = 105;
                        info.message = "文件重命名失败";
                    } else {
                        info.avatar = "http://"+hostname+":"+port+"/images/"+fileName;
                        let modSql = 'UPDATE user SET avatar = ? WHERE schoolNum = ?';
                        let sqlParams = [info.avatar, uid];
                       
                            connection.query(modSql,sqlParams,function (err, result) {
                                if(err){
                                    info.code = 105;
                                    console.log('[INSERT ERROR] - ',err.message);
                                }else{
                                    info.code = 200;
                                }
                                res.send(JSON.stringify(info));
                                return ;
                            })
                    }
                });
            }
        });
    });
//获取用户信息
    app.post("/getAllBookInfo",function (req,res,next) {
        let info = new Object();
        let sql = 'SELECT * FROM bookinfo;';
       
            connection.query(sql,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '获取书籍失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    info.code = 200;
                    let bookInfo = [];
                    for (let i = 0;i < result.length; i++){
                        bookInfo.push(result[i]);
                    }
                    info.data = bookInfo;
                    res.send(JSON.stringify(info));
                    return ;
                }
            })
    });
//用户查找书籍信息
    app.get("/findBookInfo",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let name = query.name;
        // let region = query.region;
        // let resource = query.resource;
        let modSql = "";
        modSql = "SELECT * FROM bookinfo WHERE bName LIKE '%"+name+"%';";
        let info = new Object();
       
            connection.query(modSql,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '查找失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    info.code = 200;
                    info.message = '查找成功';
                    let data = [];
                    for (let i = 0;i < result.length; i++){
                        data.push(result[i]);
                    }
                    info.data = data;
                }
                res.send(JSON.stringify(info));
                return ;
            })
    });
//用户借阅书籍
    app.get("/borrowBookConfig",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let bid = query.bid;
        let data = query.data;
        let id = query.id;
        let modSql = 'insert into userborrowbookinfo(schoolNum,bId,time) values (?,?,?)';
        let sqlParams = [id, bid, data];
        let info = new Object();
            connection.query(modSql,sqlParams,function (err, result) {
                if(err){
                    info.code = 105;
                    info.message = '借阅失败';
                    console.log('[INSERT ERROR] - ',err.message);
                }else{
                    info.code = 201;
                    info.message = '书籍状态未更改';
                    //    更改书籍表里面的书籍信息
                    let changeBookInfo = "UPDATE bookInfo SET borrow = 1 WHERE bid = ?;";
                    let changeBookParams = [bid];
                    connection.query(changeBookInfo,changeBookParams,function (err, result) {
                        if(err){
                            info.code = 105;
                            info.message = '更改书籍状态失败';
                            console.log('[INSERT ERROR] - ',err.message);
                        }else{
                            info.code = 200;
                            info.message = '借阅成功';
                        }
                        res.send(JSON.stringify(info));
                        return ;
                    });
                }
            })
    });
//用户归还书籍
    app.get("/returnBook",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let bid = query.bid;
        let id = query.id;
        let modSql = `DELETE FROM userborrowbookinfo WHERE schoolNum = ? and bId = ?;`;
        let sqlParams = [id, bid, bid];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '删除借书记录失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                let returnbook = "UPDATE bookinfo SET borrow = 0 where bid = ?;";
                let returnParams = [bid];
                connection.query(returnbook, returnParams, function (err, result) {
                    if (err) {
                        info.code = 105;
                        info.message = '删除借书记录失败';
                        console.log('[INSERT ERROR] - ', err.message);
                    } else {
                        info.code = 200;
                        info.message = "归还成功！";
                    }
                    res.send(JSON.stringify(info));
                    return ;
                })
            }
        })
    })
//    用户上传对于书籍的想法
    app.get("/uploadBookIdea",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let name = query.name;
        let des = query.des;
        let modSql = `INSERT INTO bookIdea(bName,schoolNum,bDes)
VALUES(?,?,?);`;
        let sqlParams = [name, id, des];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '删除借书记录失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.message = "创建成功！";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    })
//    获取所有用户对于书籍的看法
    app.get("/getAllIdea",function (req,res,next) {
        let modSql = `SELECT b.*,u.\`nickName\`
                        FROM bookidea b
                        LEFT JOIN USER u
                        ON b.\`schoolNum\` = u.\`schoolNum\`;`;
        let info = new Object();
        connection.query(modSql, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '获取用户看法失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                let data = [];
                for (let i = 0;i < result.length;i++){
                    data.push(result[i]);
                }
                info.code = 200;
                info.message = "创建成功！";
                info.data = data;
            }
            res.send(JSON.stringify(info));
            return ;
        })
    });
//    用户删除对于书籍的看发
    app.get("/deleteIdea",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let bName = query.bName;
        let bDes = query.bDes;
        let modSql = `delete from bookidea where bName = ? and schoolNum = ? and bDes = ?;`;
        let sqlParams = [bName, id, bDes];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '删除失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.message = "删除成功！";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    })
//    获得用户对于书籍的看发
    app.get("/getUserIdea",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let id = query.id;
        let modSql = `select * from bookidea where schoolNum = ?`;
        let sqlParams = [id];
        let info = new Object();
        connection.query(modSql, sqlParams,function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '获取用户看法失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                let data = [];
                for (let i = 0;i < result.length;i++){
                    data.push(result[i]);
                }
                info.code = 200;
                info.message = "创建成功！";
                info.data = data;
            }
            res.send(JSON.stringify(info));
            return ;
        })
    })
//    管理员增加书籍信息
    app.get("/addBookInfo",function (req, res, next) {
        let query = url.parse(req.url, true).query;
        let bName = query.bName;
        let bDes = query.bDes;
        let bCategory = query.bCategory;
        let modSql = `INSERT INTO bookinfo(bName,bCategory,bDes) VALUES(?,?,?);`;
        let sqlParams = [bName, bCategory, bDes];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '增加失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.message = "增加成功！";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    })
//    管理员获取所有书籍信息
    app.get("/manageGetBookInfo",function (req,res,next) {

        let sql =  `SELECT b.*,u.\`uname\`
                    FROM bookinfo b
                    LEFT JOIN userborrowbookinfo ubi
                    ON b.\`bid\` = ubi.\`bId\` 
                    LEFT JOIN USER u
                    ON ubi.\`schoolNum\` = u.\`schoolNum\`;`
        let info = new Object();
        connection.query(sql, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '删除借书记录失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.data = result;
            }
            res.send(JSON.stringify(info));
            return ;
        })
    });
//    获取图书的分列信息
    app.get("/getCategory",function (req,res,next) {
        let modSql = `select * from bookcategory`;
        let info = new Object();
        connection.query(modSql, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '获取书籍分类失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.data = result;
                info.message = "获取书籍分类成功";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    });
//    管理员修改书籍信息
    app.get("/manageChangeInfo",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let bid = query.bid;
        let bDes = query.bDes;
        let bName = query.bName;
        let bCategory = query.bCategory;
        let modSql = `UPDATE bookinfo SET bName = ?, bDes = ?, \`bCategory\` = ? WHERE bid = ?;`;
        let sqlParams = [bName, bDes, bCategory, bid];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '修改失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.message = "修改成功";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    });
//    管理员删除书籍信息
    app.get("/deleteBook",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let bid = query.bid;
        let modSql = `delete from bookinfo where bid = ?;`;
        let sqlParams = [bid];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '删除失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.message = "删除成功";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    });
//    管理员增加书籍分类种类
    app.get("/addNewKind",function (req,res,next) {
        let query = url.parse(req.url, true).query;
        let newName = query.addName;
        let modSql = `INSERT INTO bookcategory(cName)
VALUES(?);`;
        let sqlParams = [newName];
        let info = new Object();
        connection.query(modSql, sqlParams, function (err, result) {
            if (err) {
                info.code = 105;
                info.message = '增加失败';
                console.log('[INSERT ERROR] - ', err.message);
            } else {
                info.code = 200;
                info.message = "增加成功";
            }
            res.send(JSON.stringify(info));
            return ;
        })
    })
});
app.listen(port,hostname);
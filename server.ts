const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const port = 3000;


dotenv.config();

const app = express();
app.use(express.json()); // ใช้ express.json() แทน body-parser
app.use(express.urlencoded({ extended: true })); // ใช้ express.urlencoded() แทน body-parser

app.get("/check-db-connection", async (req, res) => {
  try {
    await prisma.$connect();
    res.send({ message: "Connected to the database" });
  } catch (error) {
    res.status(500).send({ error: "Cannot connect to database" });
  }
});
// สร้างข้อมูล
app.post('/customer/create', async (req, res) => {
    try {
        const payload = req.body;
        const customer = await prisma.customer.create({
            data: payload
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// ดูข้อมูลทั้งหมด 

app.get('/customer/list', async (req, res) => {
  try {
      const customers = await prisma.customer.findMany(); // แก้ findmany() เป็น findMany()
      res.json(customers); // ส่ง customers กลับไปยัง client
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
});

// รายละเอียดไอดี 
app.get('/customer/detail/:id', async (req, res) => {
  try { 
       const customer = await prisma.customer.findUnique({
        where: {
          id: req.params.id
        }
       });
       res.json(customer);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

//อัพเดต
app.put ('/customer/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const customer = await prisma.customer.update({
      where: {
        id: id
      },
      data: payload
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

// การลบ 
app.delete('/customer/delete/:id', async (req, res)=> {
  try {
    const id = req.params.id;
    await prisma.customer.delete({
      where: {
        id: id
      }
    });
    res.json({message: "customer delete successfully"});
  } catch (error) {
    return res.status(500).json ({error: error.message});
  }
});


app.get('/customer/startsWith', async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          startsWith: keyword
        }
      }
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
});


app.get('/customer/endsWith', async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          endsWith: keyword
        }
      }
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
});


app.get('/customer/contains', async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const customer = await prisma.customer.findMany({
      where: {
        name: {
          contains: keyword
        }
      }
    });
    res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: error.message});
  }
});


app.get('/customer/sortByName', async (req,res) =>{
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(customers);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


app.get('/customer/whereAnd', async (req, res) => {
  try {
    // ค้นหาลูกค้าที่ชื่อมี 'a' และเครดิตมากกว่าหรือเท่ากับ 0
    const customers = await prisma.customer.findMany({
      where: {
        AND: [
          {
            name: {
              contains: 'J' // ค้นหาชื่อลูกค้าที่มี 'a'
            }
          },
          {
            credit: {
              gt: 0 // เครดิตต้องมากกว่าหรือเท่ากับ 0
            }
          }
        ]
      }
    });

    // ส่งผลลัพธ์กลับไปที่ client
    res.json(customers);
  } catch (error) {
    // หากเกิดข้อผิดพลาด ส่งข้อผิดพลาดกลับไป
    res.status(500).json({ error: error.message });
  }
});


app.get('/customer/listBetweenCredit', async (req, res) => {
try {
  const customers = await prisma.customer.findMany({
    where: {
      credit: {
        gt: 150005,
        lt: 310000
      }
    }
  });
  res.json(customers);
} catch(error) {
  return res.status(500).json({error: error.message});
}

});

app.get('/customer/sumCredit', async (req, res) => {
  try 
  {
    const sumCredit = await prisma.customer.aggregate({
      _sum: {
        credit: true
      }
    });
    res.json({sumCredit: sumCredit._sum.credit});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
});


app.get('/customer/maxCredit', async (req, res) => {
  try 
  {
    const maxCredit = await prisma.customer.aggregate({
      _max: {
        credit: true
      }
    });
    res.json({maxCredit: maxCredit._max.credit});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
});


app.get('/customer/minCredit', async (req, res) => {
  try 
  {
    const minCredit = await prisma.customer.aggregate({
      _min: {
        credit: true
      }
    });
    res.json({minCredit: minCredit._min.credit});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
});


app.get('/customer/avgCredit', async (req, res) => {
  try 
  {
    const avgCredit = await prisma.customer.aggregate({
      _avg: {
        credit: true
      }
    });
    res.json({avgCredit: avgCredit._avg.credit});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
});

app.get('/customer/countCustomer', async (req, res) => {
  try {
    const count = await prisma.customer.count();
    res.json({countCustomer: count});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


app.post('/order/create', async(req, res) => {
  try {
    const customerId = req.body.customerId;
    const amount = req.body.amount;
    const order = await prisma.order.create({
       data: {
        customerId: customerId,
        amount: amount
       }
    });
    res.json(order);
  } catch (error) {
    return res.status(500).json({error: error.message});

  }
});


app.get('/customer/listOrder/:custommerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await prisma.order.findMany({
      where: {
        customerId: customerId
      }
    }); 
    res.json(orders);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


app.get('/customer/listAllOrder', async (req, res) => {
  try {
    const orders = await prisma.customer.findMany({
      include: {
        Order: true
      }
    });
    res.json(orders);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

app.get('/customer/listOrderAndProduct/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customers = await prisma.customer.findMany({
      where: {
        id: customerId
      },
      include: {
        Order: {  // ใช้ 'Order' ให้ตรงกับชื่อใน Prisma schema
          include: {
            Product: true  // ใช้ 'Product' ให้ตรงกับชื่อใน Prisma schema
          }
        }
      }
    });
    res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




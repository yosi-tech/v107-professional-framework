import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileText, TrendingUp, ShoppingCart } from "lucide-react";
import { format } from "date-fns";

export default function PaymentsTab({ paymentOrders, responses }) {
  const paidOrders = paymentOrders.filter(o => o.status === 'paid');
  const completedResponses = responses.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 text-right">סה"כ רכישות</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-green-600">{paidOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 text-right">דוחות מלאים</CardTitle>
            <FileText className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-blue-600">
              {paidOrders.filter(o => o.product_type === 'full_report').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 text-right">הורדות תשובות</CardTitle>
            <FileText className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-purple-600">
              {paidOrders.filter(o => o.product_type === 'answers_download').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 text-right">שיעור המרה</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-orange-600">
              {completedResponses.length > 0 ? `${Math.round(paidOrders.length / completedResponses.length * 100)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">פילוח רכישות לפי סוג מוצר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-semibold">סוג מוצר</th>
                  <th className="text-center py-3 px-4 font-semibold">כמות רכישות</th>
                  <th className="text-left py-3 px-4 font-semibold">סה"כ הכנסות</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50">
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-blue-900">דו"ח מלא</div>
                    <div className="text-sm text-gray-600">299 ₪ למוצר</div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge className="bg-blue-100 text-blue-800">{paidOrders.filter(o => o.product_type === 'full_report' && !o.is_express).length}</Badge>
                  </td>
                  <td className="text-left py-4 px-4">
                    <div className="text-xl font-bold text-blue-600">₪ {paidOrders.filter(o => o.product_type === 'full_report' && !o.is_express).reduce((sum, o) => sum + o.amount, 0)}</div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-purple-50">
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-purple-900">דו"ח מלא + מואץ</div>
                    <div className="text-sm text-gray-600">378 ₪ למוצר</div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge className="bg-purple-100 text-purple-800">{paidOrders.filter(o => o.product_type === 'full_report' && o.is_express).length}</Badge>
                  </td>
                  <td className="text-left py-4 px-4">
                    <div className="text-xl font-bold text-purple-600">₪ {paidOrders.filter(o => o.product_type === 'full_report' && o.is_express).reduce((sum, o) => sum + o.amount, 0)}</div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-green-50">
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-green-900">הורדת תשובות</div>
                    <div className="text-sm text-gray-600">59 ₪ למוצר</div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge className="bg-green-100 text-green-800">{paidOrders.filter(o => o.product_type === 'answers_download').length}</Badge>
                  </td>
                  <td className="text-left py-4 px-4">
                    <div className="text-xl font-bold text-green-600">₪ {paidOrders.filter(o => o.product_type === 'answers_download').reduce((sum, o) => sum + o.amount, 0)}</div>
                  </td>
                </tr>
                <tr className="bg-gradient-to-l from-green-100 to-blue-100 border-t-2 border-green-500">
                  <td className="py-4 px-4 text-right">
                    <div className="text-xl font-bold text-gray-900">סה"כ הכנסות</div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge className="bg-gray-800 text-white">{paidOrders.length}</Badge>
                  </td>
                  <td className="text-left py-4 px-4">
                    <div className="text-3xl font-bold text-green-700">₪ {paidOrders.reduce((sum, o) => sum + o.amount, 0)}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">היסטוריית תשלומים</CardTitle>
          <CardDescription className="text-right">כל ההזמנות והתשלומים במערכת</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">אין הזמנות תשלום במערכת</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentOrders.map((order) => (
                <Card key={order.id} className={`${
                  order.status === 'paid' ? 'border-green-300 bg-green-50' :
                  order.status === 'failed' ? 'border-red-300 bg-red-50' :
                  'border-yellow-300 bg-yellow-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between flex-row-reverse">
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                          <h4 className="font-semibold">{order.user_name}</h4>
                          <Badge className={order.status === 'paid' ? 'bg-green-600' : order.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}>
                            {order.status === 'paid' && 'שולם'}
                            {order.status === 'pending' && 'ממתין'}
                            {order.status === 'failed' && 'נכשל'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{order.user_email}</p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">מוצר:</span>{' '}
                            {order.product_type === 'full_report' && 'דו"ח מלא'}
                            {order.product_type === 'answers_download' && 'הורדת תשובות'}
                            {order.product_type === 'online_coaching_7days' && 'ליווי 7 ימים'}
                            {order.is_express && ' + מואץ'}
                          </p>
                          <p><span className="font-medium">סכום:</span> {order.amount}₪</p>
                          {order.coupon_code && <p><span className="font-medium">קופון:</span> {order.coupon_code}</p>}
                          {order.tranzila_reference && <p><span className="font-medium">מזהה טרנזילה:</span> {order.tranzila_reference}</p>}
                          {order.confirmation_code && <p><span className="font-medium">קוד אישור:</span> {order.confirmation_code}</p>}
                          <p className="text-xs text-gray-500">{format(new Date(order.created_date), 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
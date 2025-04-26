def child():
    child = {}
    child['営業マン'] = ['顧客']
    return child

def list_column():
    list_column = {}
    list_column['営業マン'] = [
        {
            'column': '役職',
            'values': ['営業部長', '営業主任', '営業スタッフ']
        }
    ]
    return list_column
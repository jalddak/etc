import csv

def deleteFile(fileName, btree, keyList):
    # 트리에서 노드 삭제하는 과정
    try:
        input = open('./data/' + fileName, 'r', encoding='utf-8')
    except FileNotFoundError:
        print("*** 없는 파일 입니다. ***\n")
        return None
    try:
        delete_compare = open('./data/' + fileName[0:6] + '_compare' + fileName[6:], 'r', encoding='utf-8')
    except FileNotFoundError:
        print("*** 비교할 파일이 없는 파일 입니다. ***\n")
        return None
    rdr = csv.reader(input, delimiter='\t')
    print("--- 노드 삭제하는 중 ---")
    for line in rdr:
        btree.root = btree.delete(btree.root, int(line[0]))
    input.close()
    print("--- 노드 삭제 완료 ---")

    # 삭제된 트리의 정보를 갖고있는 delete_compare 파일이랑 똑같은 파일 만들기 (search 하면서 파일만들기)
    output = open("./data/deletion.csv", 'w', encoding='utf-8')
    print("--- deletion.csv 만드는 중 ---")
    for key in keyList:
        node = btree.search(btree.root, key)
        if node is None:
            output.write(str(key) + '\tN/A\n')
        else:
            output.write(str(node.key) + '\t' + node.value + '\n')
    output.close()
    print("--- deletion.csv 완성 ---")

    # deletion.csv 파일과 delete_compare 파일을 비교하여 제대로 복사했는지 비교하기.
    deletion = open("./data/deletion.csv", 'r', encoding='utf-8')
    print("--- delete_compare 파일과 만들어진 deletion.csv 이 같은지 비교하는 중 ---")
    rdr = csv.reader(delete_compare, delimiter='\t')
    rdr2 = csv.reader(deletion, delimiter='\t')
    delete_compareList = []
    deletionList = []
    for line in rdr:
        delete_compareList.append(line)
    for line in rdr2:
        deletionList.append(line)
    if len(delete_compareList) < len(deletionList):
        print("--- deletion.csv 파일에 무언가 더 작성되었습니다. ---")
    elif len(delete_compareList) > len(deletionList):
        print("--- delete_compare 파일에 무언가 더 작성되었습니다. ---")
    else:
        error = 0
        i = 0
        for list in delete_compareList:
            if delete_compareList[i] != deletionList[i]:
                print("*** " + delete_compareList[i][0] + " 키 값에서 트리를 제대로 만들지 못했습니다. ***")
                error += 1
            i += 1
        if error == 0:
            print("--- 오류가 발견되지 않았습니다. 완벽히 일치합니다. ---")
        else:
            print("--- %d개의 키 값에서 오류가 있었습니다. ---" % error)
    print()
    delete_compare.close()
    deletion.close()

    return btree





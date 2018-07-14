package com.shashkani.collector.wallet;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface BlockRepository extends PagingAndSortingRepository<Block, String> {
}
